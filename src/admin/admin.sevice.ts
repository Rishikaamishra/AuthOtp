


import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { OtpService }  from 'src/otp/otp.service';

@Injectable()
export class AdminService {
  constructor(private users: UserService, private otps: OtpService) {}

  activateUser(id: number) 
  { return this.users.activateUser(id); }
  listUsers(p:number,l:number) 
   { return this.users.findAll({ page:p, limit:l }); }
  listDeleted()             
     { return this.users.findDeleted(); }
  listOtps()          
           { return this.otps.findAll(); }
}