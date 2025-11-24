export type Flashcard = {
  flashcardId: number
  term: string
  definition: string
  deckId: number
  image?: string
}

export type Deck = {
  deckId: number
  title: string
  privacy: boolean
  username: string
  creation: Date
}