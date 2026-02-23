 // const MangaDB = new Manga({
   //     ItemType: "Manga",
   //     Genre: "Shonen",
   //     Type: [
   //       {
   //         Title: "Demon Slayer",
   //         Author: "Koyoharu Gotouge",
   //         Artist: "Koyoharu Gotouge",
   //         Anime: "Demon Slayer",
   //         Animeurl: "",
   //         Language: "English",
   //         Genres: ["Action", "Shonen"],
   //         Publishers: ["Shueisha"],
   //         Publishinghouses: ["Jump Comics"],
   //         Originalvalue: 700,
   //         previousvalue: 650,
   //         Size: [14.8, 21.0],
   //         Marketprice: [600],
   //         Aboutmanga: ["Demon slaying adventures", "Tanjiro and Nezuko story"],
   //         Currentoffer: ["20% OFF"],
   //         No_of_Likes: [8000],
   //         No_of_Disikes: [100],
   //         previousoffer: "10% OFF",
   //         Status: "Completed",
   //         Agegroup: 15,
   //         Status_age_wise: "teenagers",
   //         versions: "colourfull",
   //         Volumes: [1, 2, 3, 4],
   //         Image: "https://example.com/ds-cover.jpg",
   //         Releasedate: new Date("2019-04-06"),
   //         Instock: true,
   //         Instockno: 120,
   //         Characters: [
   //           {
   //             Name: "Tanjiro Kamado",
   //             Penname: "None",
   //             Role: "Protagonist",
   //             Imageurl: "https://static.wikia.nocookie.net/digitousailorcure/images/6/60/Tanjiro_kamado.jpg/revision/latest?cb=20221011091445"
   //           },
   //           {
   //             Name: "Nezuko Kamado",
   //             Penname: "None",
   //             Role: "Supporting",
   //             Imageurl: "https://w0.peakpx.com/wallpaper/923/87/HD-wallpaper-kimetsu-no-yaiba-frontal-view-nezuko-kamado-nezuko-thumbnail.jpg"
   //           },
   //           {
   //             Name: "Zenitsu Agatsuma",
   //             Penname: "None",
   //             Role: "Supporting",
   //             Imageurl: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/6/66/Zenitsu_anime.png/revision/latest?cb=20181128204231"
   //           },
   //           {
   //             Name: "Inosuke Hashibira",
   //             Penname: "None",
   //             Role: "Supporting",
   //             Imageurl: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/d/d4/Inosuke_anime.png/revision/latest?cb=20181128204238"
   //           },
   //           {
   //             Name: "Kanao Tsuyuri",
   //             Penname: "None",
   //             Role: "Supporting",
   //             Imageurl: ""
   //           },
   //           {
   //             Name: "Giyu Tomioka",
   //             Penname: "None",
   //             Role: "Supporting",
   //             Imageurl: "https://i.pinimg.com/236x/30/5f/be/305fbe804e0c9c3978b411fe8cd337c7.jpg"
   //           },
   //           {
   //             Name: "Shinobu Kocho",
   //             Penname: "None",
   //             Role: "Supporting",
   //             Imageurl: ""
   //           },
   //           {
   //             Name: "Kyojuro Rengoku",
   //             Penname: "None",
   //             Role: "Supporting",
   //             Imageurl: "https://howtoanime.com//admin/images/Content-3/93061.jpg"
   //           },
   //           {
   //             Name: "Tengen Uzui",
   //             Penname: "None",
   //             Role: "Supporting",
   //             Imageurl: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/5/5e/Tengen_anime_design.png"
   //           },
   //           {
   //             Name: "Muzan Kibutsuji",
   //             Penname: "None",
   //             Role: "Antagonist",
   //             Imageurl: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/8/8e/Muzan_anime_design.png"
   //           }
   //         ],
   //         Reviewers_detail: [
   //           {
   //             ReviewerName: "Haruto A.",
   //             Rating: 5,
   //             Review: "Incredible character growth and stunning artwork!",
   //             Overallexperience: "Excellent"
   //           },
   //           {
   //             ReviewerName: "Emi S.",
   //             Rating: 4,
   //             Review: "Beautiful animation, manga adaptation is awesome!",
   //             Overallexperience: "Awesome"
   //           },
   //           {
   //             ReviewerName: "Kaito R.",
   //             Rating: 3,
   //             Review: "Good but a bit rushed near the end.",
   //             Overallexperience: "Good"
   //           }
   //         ],
   //         Volume: [
   //           {
   //             Currentvolume_no: "1",
   //             Currentvolume_name: "Cruelty",
   //             No_ofuser_buy: "3200",
   //             No_ofuser_refunded: "50",
   //             Info_about_volume: "Introduction to Tanjiro and the demon world.",
   //             No_ofchapters: 7,
   //             No_ofpages: 192,
   //             Mofifiedvolume_name: "Cruelty (Remastered)",
   //             Modifiedvolume_info: "Revised edition with colored pages.",
   //             Modifiedvolume_no_of_pages: 200
   //           },
   //           {
   //             Currentvolume_no: "2",
   //             Currentvolume_name: "It Was You",
   //             No_ofuser_buy: "2800",
   //             No_ofuser_refunded: "30",
   //             Info_about_volume: "Tanjiro begins his training and first missions.",
   //             No_ofchapters: 7,
   //             No_ofpages: 190,
   //             Mofifiedvolume_name: "None",
   //             Modifiedvolume_info: "",
   //             Modifiedvolume_no_of_pages: 0
   //           }
   //         ],
   //         NextMangaVolume: [
   //           {
   //             Nexturls: "https://example.com/demonslayer/volume3"
   //           }
   //         ],
   //         PreviousMangaVolume: [
   //           {
   //             Previous_urls: "https://example.com/demonslayer/volume1"
   //           }
   //         ],
   //         Comparepopularity: [
   //           {
   //             Currentvolume: "2",
   //             Currentvolumedate: new Date("2020-05-15"),
   //             Current_volumeLikes: 2500,
   //             Current_volumeDislikes: 100,
   //             Total_Current_volumerating_no: 1200,
   //             Previousvolume: "1",
   //             PreviousvolumeLikes: 2800,
   //             PreviousvolumeDislikes: 80,
   //             Total_Previous_volumerating_no: 1300
   //           }
   //         ]
   //       }
   //     ]
   // });