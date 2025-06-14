// Helper file to fetch the news API as a content in the landing page

import Guardian from "guardian-js";

const guardian = new Guardian("55c1b387-a773-41da-8062-3c3015fdf100", true);


export const fetchNewsApi = async () => {
    return await guardian.content.search("business", {
        format: "json",
        q: "business OR economy OR finance",
        section: "business",
        showFields: ["thumbnail", "trailText"]
    })
    .then((response) => {console.log(response.results); return response.results;});
}