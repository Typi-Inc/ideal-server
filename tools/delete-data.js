import thinky from '../src/db-model';
import { Observable } from 'rx';

Observable.from(Object.keys(thinky.models)).
	map(key => thinky.models[key]).
	flatMap(Model => Observable.fromPromise(Model)).
	flatMap(docs => Observable.from(docs)).
	flatMap(doc => Observable.fromPromise(doc.delete())).
	subscribe(console.log);
