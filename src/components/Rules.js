const Rules = ({ game }) => {
    return (
        <div>
            <h1> {game} Rules</h1>
            {game === "Rainier Blackjack" &&
                <>
                    <p> Rainier Blackjack is a variant of classic Blackjack without a static house. </p>
                    <p> Click <a href="https://en.wikipedia.org/wiki/Blackjack" target="_blank"> here</a> for classic Blackjack rules.</p>
                    <p> In Rainier Blackjack, players agree on a set number of rounds each player will deal before the game begins.
                    Starting with the first player, each player takes turns dealing as the house.</p>
                    <p> To begin the round, the house player declares their maximum bet. Each subsequent player
                    then declares their personal bet up to the house player's amount. </p>
                    <p> The round is played normally, along with splits, doubles, house Blackjack preemption, etc.</p>
                    <p> After the round is complete, winnings are then calculated based on the house player's maximum bet
                    and each player's individual bet:</p>
                    <ul>
                        <li> If a non-dealer player wins (i.e. beats the dealer or dealer busts), they are owed money 
                        <b> from the dealer </b> equaling that non-dealer player's bet.</li>
                        <li> If a dealer player wins (i.e. beats a non-dealer player or non-dealer player busts), they 
                        are owed money <b> from the player </b> equaling that non-dealer player's bet. </li>
                    </ul>
                    <p> Bets after each round (negatives and positives) should add to zero. </p>

                    <p> <b> Example 1: </b> Dealer bets $5, three non-dealer players match the bet at $5. The dealer reveals a blackjack,
                    causing each non-dealer player to lose. The dealer player is now +$15 while each other player is -$5.</p> 

                    <p> <b> Example 2: </b> Dealer bets $20, three non-dealer players bet various amounts: $6, $13, $20. 
                    The dealer busts, causing each other non-dealer player to win. The dealer player is now -$39 while 
                    each other player is +$6, +$13, and +$20 respectively. </p> 

                    <p> <b> Example 3: </b> Dealer bets $10, three non-dealer players bet various amounts: $2, $5, $10. The dealer reveals 
                    an 18, causing the following to occur: Player 2 loses $2 with a 17; Player 3 loses $0 with a 17 and a
                    19 split, Player 3 loses $0 on an 18 push. The dealer player is now +$2 while each other player is $-2, 
                    $0, and $0, respectively. </p>

                </>}
        </div>
    )
}

export default Rules
