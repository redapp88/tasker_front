import {User} from './User.model';

export class Task{
    constructor(public id:string,
                public name:string,
                public title:string,
                public description:string,
                public client:string,
                public creatDate:Date,
                public state:string,
                public worker:User){}
}