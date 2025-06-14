import {Component, OnInit} from '@angular/core';
import {Page, UserDTO, UsersService} from '../services';
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
import {Profile} from '../profile/profile';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  usersPage$: Observable<Page> | undefined;
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

  constructor(private userService: UsersService, private profileComponent: Profile) {
  }

  ngOnInit(): void {
    this.loadUsers();
    this.usersPage$?.subscribe()
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.usersPage$ = combineLatest([
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
    if (this.isCurrentUser(user.id)) {
      this.errorMessage = "Non puoi rimuovere il tuo ruolo.";
      return;
    }

    user.role = role;

    this.updateUser(user.id, role, 'roles');
  }

  updateUser(userId: number, newValue: any, type: 'roles' | 'delete'): void {
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
          throw new Error(`Unsupported role ${newValue}.`);
      }
    } else if (type === 'delete') {
      operation = this.userService.deleteUser(userId);
    } else {
      this.errorMessage = `Operazione non supportata.`;
      throw new Error(`Unsupported operation ${type}.`);
    }

    operation.subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = `Utente ${type === 'roles' ? 'ruoli aggiornati' : 'eliminato'} con successo!`;
        this.loadUsers();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = `Errore durante l'operazione.`;
        console.error('Error during operation:', error);
      }
    });
  }

  confirmDelete(user: UserDTO): void {
    if (this.isCurrentUser(user.id)) {
      this.errorMessage = "Non puoi eliminare il tuo stesso account!";
      return;
    }
    if (confirm(`Sei sicuro di voler eliminare l'account di ${user.username}? Questa operazione è irreversibile.`)) {
      this.updateUser(user.id, null, 'delete');
    }
  }

  isCurrentUser(userId: number): boolean {
    if (!this.profileComponent.currentUser) {
      this.profileComponent.loadUserProfile();
    }
    return this.profileComponent.currentUser?.id === userId;
  }

}
