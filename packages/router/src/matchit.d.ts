declare module "@poppinss/matchit" {
  export interface Token {
    old: string;
    end: string;
    type: number;
    val: string;
  }

  export function parse(pattern: string): Token[];
  export function match(path: string, routes: Token[]): Token[];
}
