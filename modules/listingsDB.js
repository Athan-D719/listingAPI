const mongoose = require("mongoose");
const listingSchema = require("./listingSchema");

module.exports = class ListingsDB {
  constructor() {
    // We don't have a `Listing` object until initialize() is complete
    this.Listing = null;
  }

  // Pass the connection string to `initialize()`
  initialize(connectionString) {
    return new Promise((resolve, reject) => {
      const db = mongoose.createConnection(connectionString);

      db.once('error', (err) => {
        reject(err);
      });
      db.once('open', () => {
        this.Listing = db.model("listing", listingSchema);
        resolve();
      });
    });
  }

  async addNewListing(data) {
    const newListing = new this.Listing(data);
    await newListing.save();
    return newListing;
  }

  // async getAllListings(page, perPage, name) {

  //   console.log("HELEEE")
  //   let findBy = name ? { "name": { "$regex": name, "$options": "i" } } : {}

  //   if (+page && +perPage) {
  //     return this.Listing.find(findBy, {reviews: 0}).sort({ number_of_reviews: -1 }).skip((page - 1) * +perPage).limit(+perPage).exec();
  //   }

  //   return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
  // }

  async getAllListings(page, perPage, name) {
    console.log("Entered getAllListings method"); // Debug statement to indicate that the method is called
    console.log("Page:", page, "PerPage:", perPage, "Name:", name); // Debug statement to print input parameters

    let findBy = name ? { "name": { "$regex": name, "$options": "i" } } : {}
    console.log("FindBy:", findBy); // Debug statement to print the findBy query object

    if (+page && +perPage) {
        console.log("Valid page and perPage parameters"); // Debug statement to indicate that the parameters are valid

        const result = await this.Listing.find(findBy, {reviews: 0})
                                            .sort({ number_of_reviews: -1 })
                                            .skip((page - 1) * +perPage)
                                            .limit(+perPage)
                                            .exec();
        console.log("Result:", result); // Debug statement to print the query result
        return result;
    }

    console.log("Invalid page or perPage parameters"); // Debug statement to indicate that the parameters are invalid
    return Promise.reject(new Error('page and perPage query parameters must be valid numbers'));
}


  async getListingById(id) {
    return this.Listing.findOne({ _id: id }).exec();
  }

  async updateListingById(data, id) {
    return this.Listing.updateOne({ _id: id }, { $set: data }).exec();
  }

  async deleteListingById(id) {
    return this.Listing.deleteOne({ _id: id }).exec();
  }
}

//   async addNewListing(data) {
//     const newListing = new this.Listing(data);
//     await newListing.save();
//     return newListing;
//   }

//   async getAllListings(page, perPage, name) {
//     try {
//       const skip = (page - 1) * perPage;
//       const findBy = name ? { "name": { "$regex": name, "$options": "i" } } : {};
//       const listings = await this.Listing.find(findBy, { reviews: 0 })
//         .sort({ number_of_reviews: -1 })
//         .skip(skip)
//         .limit(perPage);
//       return listings;
//     } catch (err) {
//       console.log("hello")
//     }
//   }

//   async getListingById(id) {
//     try {
//       const listing = await this.Listing.findById(id);
//       return listing;
//     } catch (err) {
//       throw err;
//     }
//   }

//   async updateListingById(data, id) {
//     try {
//       const updatedListing = await this.Listing.findByIdAndUpdate(id, data, { new: true });
//       return updatedListing;
//     } catch (err) {
//       throw err;
//     }
//   }

//   async deleteListingById(id) {
//     try {
//       await this.Listing.findByIdAndDelete(id);
//     } catch (err) {
//       throw err;
//     }
//   }
// }

