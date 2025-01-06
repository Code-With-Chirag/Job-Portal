// import mongoose from 'mongoose';

// const companySchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     description:{
//         type:String
//     },
//     website:{
//         type:String
//     },
//     location:{
//         type:String
//     },
//     logo:{
//         type:String
//     },
//     userId:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'User',
//         required:true,
//     }
// },
// {timestamps:true});
// export const Company =mongoose.model("Company",companySchema);




import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Company name is required'],
        unique: true,
        minlength: [3, 'Company name must be at least 3 characters long'],
        maxlength: [50, 'Company name cannot exceed 50 characters'],
        trim: true
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        trim: true
    },
    website: {
        type: String,
        match: [
            /^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+)\.[a-z]{2,}([a-zA-Z0-9/.]*)?$/,
            'Please enter a valid website URL'
        ],
        trim: true
    },
    location: {
        type: String,
        maxlength: [100, 'Location cannot exceed 100 characters'],
        trim: true
    },
    logo: {
        type: String,
        match: [
            /\.(jpg|jpeg|png|gif|svg)$/i,
            'Logo must be a valid image URL (jpg, jpeg, png, gif, svg)'
        ]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},
    { timestamps: true });

export const Company = mongoose.model('Company', companySchema);
