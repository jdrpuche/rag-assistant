export class Document {
  constructor(
    public id: string,
    public filename: string,
    public content: string,
    public chunks: Chunk[] = []
  ) {}
}

export class Chunk {
  constructor(
    public id: string,
    public content: string,
    public embedding?: number[]
  ) {}
}

export class Question {
  constructor(public text: string) {}
}

export class Answer {
  constructor(public text: string, public sources: Chunk[]) {}
}