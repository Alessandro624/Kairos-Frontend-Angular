import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService, Page, UserDTO, UsersService} from '../services';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Observable, of,
  switchMap,
  tap
} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    AsyncPipe,
    NgClass
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit, OnDestroy {
  usersPage: BehaviorSubject<Page | null> = new BehaviorSubject<Page | null>(null);
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  private pageSubject = new BehaviorSubject<number>(0);
  private sizeSubject = new BehaviorSubject<number>(10);
  private sortBySubject = new BehaviorSubject<string>('username');
  private directionSubject = new BehaviorSubject<'ASC' | 'DESC'>('ASC');

  currentPage: number = 0;
  pageSize: number = 10;
  sortBy: string = 'username';
  sortDirection: 'ASC' | 'DESC' = 'ASC';

  pageSizes: number[] = [5, 10, 20, 30];
  sortFields: { value: string, name: string }[] = [
    {value: 'username', name: 'Username'},
    {value: 'email', name: 'Email'},
    {value: 'firstName', name: 'Nome'},
    {value: 'lastName', name: 'Cognome'}
  ];

  currentUsername: string | null = null;

  showDeleteModal: boolean = false;
  userToDelete: UserDTO | null = null;

  constructor(private userService: UsersService, private authService: AuthenticationService) {
  }

  ngOnDestroy(): void {
    this.usersPage.complete();
    this.currentUsername = null;
    console.log('Admin component destroyed.');
  }

  ngOnInit(): void {
    this.authService.getUsername().subscribe({
      next: (username) => {
        this.currentUsername = username;
        console.log('Current username:', username);
      },
      error: (error) => {
        console.error('Error during username retrieval:', error);
      }
    });
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    combineLatest([
      this.pageSubject.asObservable(),
      this.sizeSubject.asObservable(),
      this.sortBySubject.asObservable(),
      this.directionSubject.asObservable()
    ]).pipe(
      debounceTime(100),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      switchMap(([page, size, sortBy, direction]) => {
        this.currentPage = page;
        this.pageSize = size;
        this.sortBy = sortBy;
        this.sortDirection = direction;

        return this.userService.getAllUsers(page, size, sortBy, direction).pipe(
          tap(() => this.isLoading = false),
          catchError((error) => {
            this.isLoading = false;
            this.errorMessage = 'Errore durante il caricamento degli utenti.';
            console.error('Errore nel caricamento utenti:', error);
            return of({} as Page);
          })
        );
      })
    ).subscribe(
      (pageData: Page) => {
        this.usersPage.next(pageData);
      }
    );
  }

  onPageChange(page: number): void {
    if (page >= 0) {
      this.pageSubject.next(page);
    }
  }

  onSizeChange(event: Event): void {
    const newSize = parseInt((event.target as HTMLSelectElement).value, 10);
    this.sizeSubject.next(newSize);
    this.pageSubject.next(0);
  }

  onSortChange(event: Event): void {
    const newSortBy = (event.target as HTMLSelectElement).value;
    this.sortBySubject.next(newSortBy);
    this.pageSubject.next(0);
  }

  onDirectionChange(event: Event): void {
    const newDirection = (event.target as HTMLSelectElement).value as 'ASC' | 'DESC';
    this.directionSubject.next(newDirection);
    this.pageSubject.next(0);
  }

  isUserRole(user: UserDTO, role: string): boolean {
    return user.role === role;
  }

  toggleRole(user: UserDTO, role: string): void {
    if (this.isCurrentUser(user.username)) {
      this.errorMessage = "Non puoi rimuovere il tuo ruolo.";
      return;
    }

    this.updateUser(user.id, role, 'roles');
  }

  updateUser(userId: string, newValue: any, type: 'roles' | 'delete'): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    let operation: Observable<any>;

    if (type === 'roles') {
      switch (newValue) {
        case 'ORGANIZER':
          operation = this.userService.makeUserOrganizer(userId);
          break;
        case 'ADMIN':
          operation = this.userService.makeUserAdmin(userId);
          break;
        default:
          this.errorMessage = `Ruolo non supportato.`;
          this.isLoading = false;
          throw new Error(`Unsupported role ${newValue}.`);
      }
    } else if (type === 'delete') {
      operation = this.userService.deleteUser(userId);
    } else {
      this.errorMessage = `Operazione non supportata.`;
      this.isLoading = false;
      throw new Error(`Unsupported operation ${type}.`);
    }

    operation.subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = `${type === 'roles' ? 'Ruolo aggiornato' : 'Utente eliminato'} con successo!`;

        const currentPageData = this.usersPage.getValue();
        if (currentPageData) {
          if (type === 'roles') {
            const updatedContent = currentPageData.content.map((user: UserDTO) => {
              if (user.id === userId) {

                return {...user, role: newValue};
              }
              return user;
            });

            this.usersPage.next({...currentPageData, content: updatedContent});
          } else if (type === 'delete') {
            const updatedContent = currentPageData.content.filter((user: UserDTO) => user.id !== userId);

            const updatedTotalElements = currentPageData.totalElements - 1;

            this.usersPage.next({...currentPageData, content: updatedContent, totalElements: updatedTotalElements});

            if (updatedContent.length === 0 && this.currentPage > 0) {
              this.onPageChange(this.currentPage - 1);
            }
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = `Errore durante l'operazione.`;
        console.error('Error during operation:', error);
      }
    });
  }

  confirmDelete(user: UserDTO): void {
    if (this.isCurrentUser(user.username)) {
      this.errorMessage = "Non puoi eliminare il tuo stesso account!";
      return;
    }
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  proceedDelete(): void {
    if (this.userToDelete) {
      this.updateUser(this.userToDelete.id, null, 'delete');
      this.showDeleteModal = false;
      this.userToDelete = null;
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
    this.errorMessage = null;
  }

  isCurrentUser(username: string): boolean {
    return this.currentUsername === username;
  }
}
