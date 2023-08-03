import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Route, Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
	selector: 'app-start-screen',
	templateUrl: './start-screen.component.html',
	styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
	private firestore: Firestore = inject(Firestore);
	constructor(private rotuer: Router) {

	}

	ngOnInit(): void {

	}

	async newGame() {
		let newGame = new Game();
		let responseGame = await addDoc(collection(this.firestore, 'games'), newGame.toJson())
		this.rotuer.navigateByUrl('game/'+ responseGame.id);
	}

}
