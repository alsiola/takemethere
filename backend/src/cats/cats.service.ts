import { Injectable } from "@nestjs/common";

@Injectable()
export class CatsService {
    private cats = [
        { id: 1, name: "Felix" },
        { id: 2, name: "Buster" }
    ];

    getCats() {
        return this.cats;
    }

    getCatById(id: number) {
        return this.cats.find((cat) => cat.id === id);
    }

    createCat(name: string) {
        const cat = { id: this.cats.length + 1, name };
        this.cats.push(cat);
        return cat;
    }
}
