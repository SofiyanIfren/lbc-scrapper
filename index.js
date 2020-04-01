//const http = require('http');
//const rp = require('request-promise')
const fs = require('fs');
const axios = require("axios");
const cheerio = require('cheerio');

const cookies = '' // ici, on récupère un cookie depuis le navigateur (ainsi que user-agent)
const user_agent = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:74.0) Gecko/20100101 Firefox/74.0'
const classes = []
const links = []

function detail_page (page_link){
	axios
    	.request({
        	url : 'https://www.leboncoin.fr' + page_link,
			method: "get",
		    headers:{
		        'Cookie': cookies,
		        'User-Agent' : user_agent
		    }
        })
        .then(response_job => {
        	const $ = cheerio.load(response_job.data)
        	$ ('._3Jxf3').each(function (i, e) {
        		console.log(page_link)
        		fs.appendFileSync('./offres_emploi_paca.txt', page_link+' => '+$(this).text()+'\n');
        	})
        	fs.appendFileSync('./offres_emploi_paca.txt',
        		'************************************************************************************\n');
        })
        .catch(console.error)
}

function menu_page (){
	for (let i=0; i<100; i++){
		const url = 'https://www.leboncoin.fr/offres_d_emploi/offres/provence_alpes_cote_d_azur/p-'+i+'/'

		axios
			.request({
				url : url,
				method: "get",
			    headers:{
			        'Cookie': cookies,
			        'User-Agent' : user_agent
			    }
			})
			.then(response => {
			    const html = response.data
			    //const headers = response.headers
			    const $ = cheerio.load(html)
			    
			    $('.clearfix').each(function (i, e) {
			        classes[i] = $(this).text()
			        links[i] = $(this).attr('href')
			        detail_page(links[i])
			    })
			})
			.catch(console.error);
	}
}
// ***********************************
// ********** main function **********
// ***********************************
menu_page()
console.log('Node server running on port 3000');
