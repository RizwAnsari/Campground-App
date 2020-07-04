var mongoose = require('mongoose'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment');

var datas = [
	{
		name: 'Tso Moriri Lake',
		image: 'https://www.holidify.com/images/cmsuploads/compressed/640px-Tsomoriri_Lake_DSC4010_20190212171119.jpg',
		description:
			'Tsomoriri Lake is the highest lake in the world and located in Ladakh. Camping here is the experience of a lifetime. The lake is completely frozen during the winters and is an excitingly unique thing to witness. The best time to camp here is during May to September and it is simply wonderful to spend time in the decorated tents. You can trek in the nearby Ladakh region and witness the mesmerizing sunset at the lake. The best part is that the tents are comfortable with electricity supply.',
		author: {
			id: '588c2e092403d111454fff76',
			username: 'Jack'
		}
	},
	{
		name: 'Camp Exotica',
		image: 'https://www.holidify.com/images/cmsuploads/compressed/tent-1208201_1920_20190212172038.jpg',
		description:
			'The Camp Exotica is a perfect weekend getaway option located in Kullu in the Manali district of Himachal Pradesh. The accommodation provided is world class and the tents simply leave you connecting with nature like never before. The location of these tents is such that it gives a panoramic view of the surrounding mountains. The food provided is of fine quality and the incredible view will simply leave you in awe of this adventure. Make sure to take out time for this pleasure full camping trip.',
		author: {
			id: '588c2e092403d111454fff71',
			username: 'Jill'
		}
	},
	{
		name: 'West Ladakh Camp',
		image: 'https://www.holidify.com/images/cmsuploads/compressed/24366507140_38f32204a4_z_20190212174301.jpg',
		description:
			'If you are planning to go on a trekking trip to Ladakh, you can make it even more adventurous by camping at the West Ladakh Camp. This beautiful campsite is sprawled across 20 acres of ranch and is ideally situated close to the Indus River. The tents are so placed that these are surrounded by apricot and willow trees which nest the migratory birds. You can set your base here and go trekking in the nearby region and visit the Buddhist Monasteries. The food served here is authentic Tibetan and Ladakhi food making it a unique culinary experience.',
		author: {
			author: {
				id: '588c2e092403d111454fff77',
				username: 'Jane'
			}
		}
	},
	{
		name: 'Nameri Eco Camp',
		image: 'https://www.holidify.com/images/cmsuploads/compressed/4877785757_958e85201d_z_20190212174518.jpg',
		description:
			'Going by the name one thing must be clear that it is a 100% eco-friendly camp. This camp has become one of the most sought after because of its superb location and the environmental protection efforts. It is located in the district of Sonetpur which is the 3rd National Park of Assam. This camp is not only known for its splendid location but also its various adventure activities. You can go on a hike in the nearby woods or for an exciting rafting session in the Bhoroli River. The best part of this place is the chance of spotting over 300 species of birds. This does sound like a bird lover’s paradise.',
		author: {
			id: '588c2e092403d111454fff77',
			username: 'Jane'
		}
	}
];

function seedDB() {
	Campground.deleteMany({}, function(error) {
		if (error) {
			console.log(error);
		} else {
			console.log('Campgrounds Removed');
			datas.forEach(function(data) {
				Campground.create(data, function(error, createdCamp) {
					if (error) {
						console.log(error);
					} else {
						console.log('Campgrounds Added');
						Comment.create(
							{
								text: 'Comment goes here',
								// author: 'Homer',
								author: {
									author: {
										id: '588c2e092403d111454fff77',
										username: 'Jane'
									}
								}
							},
							function(error, createdComment) {
								if (error) {
									console.log(error);
								} else {
									createdCamp.comments.push(createdComment);
									createdCamp.save();
									console.log('New Comment Created');
								}
							}
						);
					}
				});
			});
		}
	});
}
module.exports = seedDB;
