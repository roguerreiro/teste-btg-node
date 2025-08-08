export class User {
    private id: number = -1;
    private username: string;
    private secret: string = '';

    constructor(username: string, id: number, secret: string) {
        this.username = username;
        this.id = id;
        this.secret = secret;
    }

    registerUser(): boolean {
        // TODO
        this.id = 0;
        return true;
    }

    getId(): number {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

}