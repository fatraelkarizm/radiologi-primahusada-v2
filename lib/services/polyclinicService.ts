import { PolyclinicRepository } from "../repositories/polyclinicRepository";

export class PolyclinicService {
     private repository: PolyclinicRepository;

     constructor() {
          this.repository = new PolyclinicRepository();
     }

     async listPolyclinics() {
          return await this.repository.getAll();
     }
}
