import { Component, OnInit, Input, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, setDoc, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
	private firestore: Firestore = inject(Firestore);
	@Input() id: string = '';
	gameData$: Observable<Game[]>;
	GameData:Array<any> | undefined;
	game!: Game;
	gameID: any


	constructor(public route: ActivatedRoute, public dialog: MatDialog) {
		const deutscheBahn = collection(this.firestore, 'games');
		this.gameData$ = collectionData(deutscheBahn) as Observable<Game[]>;
		
		this.gameData$.subscribe( (newGameData) => {
			this.GameData = newGameData;
			console.log('this.GameData: ', this.GameData);
		})
		
 	}

	 ngOnInit(): void {
		this.newGame();
		this.route.params.subscribe((params) => {
			this.gameID = params['id']
		  console.log(params['id']);
			
		  const docRef = doc(this.firestore, 'games', params['id']);
		  docData(docRef)
		  .subscribe((game: any) => {
			console.log('Game update', game);
			this.game.currentPlayer = game.currentPlayer;
			this.game.playedCards = game.playedCards;
			this.game.players = game.players;
			this.game.stack = game.stack;
			this.game.currentCard = game.currentCard;
			this.game.pickCardAnimation = game.pickCardAnimation;
		  });
	
		//   this
		// 	.firestore
		// 	.collection('games')
		// 	.doc(params['id'])
		// 	.valueChanges()
		// 	.subscribe((game: any) => {
		// 	  console.log('Game update', game);
		// 	  this.game.currentPlayer = game.currentPlayer;
		// 	  this.game.playedCards = game.playedCards;
		// 	  this.game.players = game.players;
		// 	  this.game.stack = game.stack;
		// 	});
	
		});
	
	  }

	newGame() {
		this.game = new Game();
		//this.DeutscheBahn.add(this.game.toJson())
		
	}

	takeCard() {
		if (!this.game.pickCardAnimation) {
			this.game.currentCard = this.game.stack.pop();
			this.game.pickCardAnimation = true
			console.log('this.currentCard: ', this.game.currentCard);
			console.log(this.game)
			this.game.currentPlayer++
			this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
			this.saveGame()
			setTimeout(() => {
				this.game.playedCards.push(this.game.currentCard)
				this.game.pickCardAnimation = false
			}, 1000);
		}
	}


	openDialog(): void {
		const dialogRef = this.dialog.open(DialogAddPlayerComponent)

		dialogRef.afterClosed().subscribe(name => {
			if (name && name.length > 0) {
				this.game.players.push(name)
				this.saveGame()
			}
		});
	}

	saveGame() {
		let coll = collection(this.firestore, 'games');
		console.log('coll: ', coll);
		let jsonGame = this.game.toJson()
		console.log('jsonGame: ', jsonGame);

		updateDoc(doc(coll, this.gameID), {currentPlayer: jsonGame.currentPlayer, playedCards: jsonGame.playedCards,stack: jsonGame.stack, players: jsonGame.players, pickCardAnimation: jsonGame.pickCardAnimation, currentCard: jsonGame.currentCard})

	}
}
