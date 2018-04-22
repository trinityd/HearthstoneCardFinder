// Partial search URL:
// https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/{name}

function searchCards() {
	let name = $('#input').val();
	let apiCall = `https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/${name}`;
	let prodKey = 'jlLw9oszzTmshV46ZR5HYcm0GJN3p1VOFpxjsnaY0bUNcE0183';

	let ajax = new XMLHttpRequest();
	ajax.onload = gotJSON;
	ajax.onerror = function(err) { console.log(err); }
	ajax.open('GET', apiCall, true);
	ajax.setRequestHeader('X-Mashape-Key', prodKey);
	ajax.send();
}

function gotJSON(json) {
	let results = $('#results');
	results.empty();

	let response = JSON.parse(json.currentTarget.response);
	response.sort(sortCards);
	console.log(response);
	
	if(response.error == 404)
	{
		results.text('No results.');
	}
	else
	{
		for(let card of response)
		{
			let name = card.name;
			let newCard = $('<div></div>');
			newCard.addClass('card');

			let cardImg = $('<img></img>');
			cardImg.addClass('cardimg');
			cardImg.attr('src', card.img);
			newCard.append(cardImg);

			// let cardName = $('<p></p>');
			// cardName.addClass('cardname');
			// cardName.text(name);
			// newCard.append(cardName);

			$('#results').append(newCard);
		}
	}
}

function sortCards(a, b)
{
	let by = $('#sort option:selected').attr('name');
	let order = 'asc';
	if($('#order').html() == 'Descending') order = 'desc';

	if(by == 'name')
	{
		if(order == 'asc') return a.name.localeCompare(b.name);
		else return b.name.localeCompare(a.name);
	}
	else if(by == 'cost')
	{
		let c1 = a.cost;
		let c2 = b.cost;
		if(c1 == undefined) c1 = 0;
		if(c2 == undefined) c1 = 0;

		if(order == 'asc') return c1 - c2;
		else return c2 - c1;
	}
	else if(by == 'rarity')
	{
		let rarities = ['Free', 'Common', 'Rare', 'Epic', 'Legendary'];
		let r1 = rarities.indexOf(a.rarity);
		let r2 = rarities.indexOf(b.rarity);
		if(r1 == -1 || a.rarity == undefined) r1 = 0;
		if(r2 == -1 || b.rarity == undefined) r2 = 0;

		if(order == 'asc') return r1 - r2;
		else return r2 - r1;
	}
}

$('#search').click(searchCards);

$('#order').click(function() {
	console.log($(this).html());
	if($(this).html() == 'Ascending')
	{
		$(this).html('Descending');
	}
	else $(this).html('Ascending');
});

$(document).keypress(function(e) {
    if(e.which == 13)
    {
    	searchCards();
    }
});