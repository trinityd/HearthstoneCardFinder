// Partial search URL:
// https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/{name}

// Wiki search URL:
// https://hearthstone.gamepedia.com/index.php?search={name}

function searchCards() 
{
	let name = $('#input').val();
	let apiCall = `https://omgvamp-hearthstone-v1.p.mashape.com/cards/search/${name}`;
	let prodKey = 'jlLw9oszzTmshV46ZR5HYcm0GJN3p1VOFpxjsnaY0bUNcE0183';

	let ajax = new XMLHttpRequest();
	ajax.onload = gotResponse;
	ajax.onerror = function(err) { console.log(err); }
	ajax.open('GET', apiCall, true);
	ajax.setRequestHeader('X-Mashape-Key', prodKey);
	ajax.send();
}

function imageExists(image_url)
{
    let http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;
}

function gotResponse(progressEvent) 
{
	let results = $('#results');
	results.empty();

	let response = JSON.parse(progressEvent.currentTarget.response);

	if(response.error == 404)
	{
		results.text('No results.');
	}
	else
	{
		response.sort(sortCards);
	
		for(let card of response)
		{
			if(card.img != undefined && imageExists(card.img))
			{
				let name = card.name;
				let cardLink = $('<a></a>');
				cardLink.attr('href', `https://hearthstone.gamepedia.com/index.php?search=${name}`);
				cardLink.on('click', function() {
					chrome.tabs.create({url: $(this).attr('href')});
				});

				let newCard = $('<div></div>');
				newCard.addClass('card');

				let cardImg = $('<img></img>');
				cardImg.addClass('cardimg');
				cardImg.attr('src', card.img);
				newCard.append(cardImg);
				cardLink.append(newCard);

				$('#results').append(cardLink);
			}
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