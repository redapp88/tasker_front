import {Task} from './Task.model';
import {Photo} from './Photo.model';

export class Stage{
    constructor(public id:string,
                public comment:string,
                public stageDate:Date,
                public task:Task,
                public photos:Photo[]){}
}