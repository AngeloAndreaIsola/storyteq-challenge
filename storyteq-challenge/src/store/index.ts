import { defineStore } from "pinia";

export interface Book {
  title: string;
  author: string;
}

export interface DatasetState {
  cities: string[];
  books: Book[];
  searchResults: {
    cities: string[];
    books: Book[];
  };
}

export const useDatasetStore = defineStore("dataset", {
  state: (): DatasetState => ({
    cities: [
      "san jose",
      "santiago",
      "san francisco",
      "santa rosa",
      "san juan",
      "sabadell",
      "salamanca",
      "salt lake city",
      "salinas",
      "salem",
      "sausalito",
      "taipei",
      "tel aviv",
      "tempe",
      "termez",
      "temuco",
      "tiajuna",
      "tieling",
      "thousand oaks",
      "thunder bay",
      "tokyo",
      "tulsa",
    ],
    books: [
      { title: "Don Quixote", author: "Miguel De Cervantes" },
      { title: "Pilgrim's Progress", author: "John Bunyan" },
      { title: "Robinson Crusoe", author: "Daniel Defoe" },
      { title: "Gulliver's Travels", author: "Jonathan Swift" },
      { title: "Tom Jones", author: "Henry Fielding" },
      { title: "Clarissa", author: "Samuel Richardson" },
      { title: "Tristram Shandy", author: "Laurence Sterne" },
    ],
    searchResults: {
      cities: [],
      books: [],
    },
  }),
  actions: {
    searchCities(query: string): void {
      if (query.length < 3) {
        this.searchResults.cities = [];
        return;
      }
      const q = query.toLowerCase();
      this.searchResults.cities = this.cities.filter((city: string) =>
        city.toLowerCase().includes(q)
      );
    },
    searchBooks(query: string): void {
      if (query.length < 3) {
        this.searchResults.books = [];
        return;
      }
      const q = query.toLowerCase();
      this.searchResults.books = this.books.filter((book: Book) =>
        book.title.toLowerCase().includes(q)
      );
    },
  },
});
