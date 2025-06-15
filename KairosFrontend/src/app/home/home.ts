import {Component, OnInit} from '@angular/core';
import {EventDTO} from '../services';
import {CurrencyPipe, DatePipe} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  featuredEvents: EventDTO[] = [];
  categories: string[] = []

  constructor() {
    this.loadFakeEvents();
    this.categories = this.featuredEvents.map(event => event.category).filter((value, _index, self) => !self.includes(value));
  }

  ngOnInit(): void {
    this.loadFakeEvents();
    this.categories = this.featuredEvents.map(event => event.category)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  private loadFakeEvents(): void {
    this.featuredEvents = [
      {
        id: 1,
        title: 'Concerto Rock Estivo',
        description: 'La band più attesa dell\'estate suonerà i suoi più grandi successi in una serata indimenticabile.',
        category: 'Musica',
        dateTime: '2025-07-15T21:00:00',
        maxParticipants: 5000,
        organizerId: 101,
        structureId: 201,
        sectors: [{name: 'Parterre', price: 50}],
        images: ['']
      },
      {
        id: 2,
        title: 'Fiera del Libro 2025',
        description: 'Incontra i tuoi autori preferiti e scopri le ultime novità editoriali.',
        category: 'Cultura',
        dateTime: '2025-09-20T09:00:00',
        maxParticipants: 10000,
        organizerId: 102,
        structureId: 202,
        sectors: [{name: 'Ingresso', price: 10}],
        images: ['']
      },
      {
        id: 3,
        title: 'Workshop di Fotografia Paesaggistica',
        description: 'Impara le tecniche per catturare paesaggi mozzafiato con un fotografo professionista.',
        category: 'Formazione',
        dateTime: '2025-08-10T10:00:00',
        maxParticipants: 30,
        organizerId: 103,
        structureId: 203,
        sectors: [{name: 'Corso Base', price: 150}],
        images: ['']
      },
      {
        id: 4,
        title: 'Serata Pop Live',
        description: 'Una serata dedicata ai successi pop degli ultimi anni.',
        category: 'Musica',
        dateTime: '2025-09-22T20:30:00',
        maxParticipants: 1200,
        organizerId: 104,
        structureId: 204,
        sectors: [{name: 'Standard', price: 30}],
        images: ['']
      },
      {
        id: 5,
        title: 'Jazz Night al Parco',
        description: 'Musica jazz sotto le stelle in un\'atmosfera rilassante.',
        category: 'Musica',
        dateTime: '2025-08-03T19:00:00',
        maxParticipants: 500,
        organizerId: 105,
        structureId: 205,
        sectors: [{name: 'Ingresso Gratuito', price: 0}],
        images: ['']
      },
      {
        id: 6,
        title: 'La Traviata - Special Edition',
        description: 'Un\'opera lirica senza tempo riproposta in una veste speciale.',
        category: 'Musica',
        dateTime: '2025-10-10T20:00:00',
        maxParticipants: 800,
        organizerId: 106,
        structureId: 206,
        sectors: [{name: 'Platea', price: 80}],
        images: ['']
      },
      {
        id: 7,
        title: 'Campionato Nazionale - Finale',
        description: 'La partita decisiva per il titolo nazionale di calcio.',
        category: 'Sport',
        dateTime: '2026-06-01T18:00:00',
        maxParticipants: 40000,
        organizerId: 107,
        structureId: 207,
        sectors: [{name: 'Tribuna', price: 40}],
        images: ['']
      },
      {
        id: 8,
        title: 'Maratona della Città Eterna',
        description: 'Partecipa alla storica maratona attraverso i monumenti più iconici della capitale.',
        category: 'Sport',
        dateTime: '2025-10-25T08:00:00',
        maxParticipants: 15000,
        organizerId: 108,
        structureId: 208,
        sectors: [{name: 'Partecipazione', price: 30}],
        images: ['']
      }
    ];
  }

  scrollDown() {
    const targetElement: HTMLElement | null = document.querySelector('.container.my-5');
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 125,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
}
