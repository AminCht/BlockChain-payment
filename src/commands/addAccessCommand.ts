import { Command, CommandRunner, Option } from 'nest-commander';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EndPointAccess } from '../database/entities/endpoint_acess.entity';
import * as fs from 'fs-extra';

@Command({ name: 'add-access' })
export class AddAccessCommand extends CommandRunner {
  constructor(
    @InjectRepository(EndPointAccess)
    private readonly accessRepo: Repository<EndPointAccess>,
  ) {
        super();
    }
    async run(
        passedParams: string[],
        options?: Record<string, any>,
    ): Promise<void> {
        const accesses = await this.getDataFromJson();
        await this.addAccess(accesses);
    }

    async getDataFromJson(){
        // TODO: fix this one
        return await fs.readJson('src/apikey/token.json');
    }

    async addAccess(accesses){
        for(const item of accesses){
            const access = await this.accessRepo.findOne({
                where:{
                    name: item.accessName
                }
            });
            if(!access){
                const access =this.accessRepo.create({
                    name: item.accessName
                });
                await this.accessRepo.save(access);
            }
        }
    }
    
}
