const Prod_Model = require('../models/product');

const getAllProductsStatic = async (req,res)=>{
    const search = 'oo'
    const products = await Prod_Model.find({price:{$gt:30}}).sort('-price')
    res.status(200).json({products, nbHits: products.length});
};

const getAllProducts = async (req,res)=>{
    const queryObj = {}; 
    const {featured ,company, name, sort, fields, NumFilter} = req.query;
    console.log(req.query);
    if(featured){
        queryObj.featured = featured==='true' ? true : false;
    }
    if(company){
        queryObj.company = company ;
    }
    if(name){
        queryObj.name = {$regex: name, $options: 'i'} ;
    }

    // Perform Numeric Operations according to user's input to filter the documents in collection
    if(NumFilter){
        const operatorMap1 = {
            '>' :'$gt' ,
            '>=':'$gte',
            '<' :'$lt' ,
            '<=':'$lte',
            '=' :'$eq'
        }
        const regEx = /\b(>|<|>=|<=|=)\b/g;
    
    // In the NumFilter array for each String in it replace all the chars or word with -${operatorMap1[match]}- if they satisfies regEx Condn and store new String in upd_Numfilter. 
    // Here 'match' is the char which satisfies regEx condn and is going to be replaced
    let upd_Numfilter = NumFilter.replace(
        regEx,
        (match)=> `-${operatorMap1[match]}-`);

    console.log(upd_Numfilter);
    const Num_prop_optns = ['price','rating'];

    upd_Numfilter = upd_Numfilter.split(',').forEach((item)=>{
        const [prop, operator, value] = item.split('-');
        if(Num_prop_optns.includes(prop)){
            queryObj[prop] = {[operator]: Number(value)};
        }  
    });
    console.log(queryObj);
  }

    // Stored Promise in result
    let result = Prod_Model.find(queryObj);

    // Perfomed sort() on Promise according to user input
    if(sort){
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    }
    else{result = result.sort('CreatedAt');}

    // Perfomed select() on Promise according to user's input
    if(fields){
        const fieldList = fields.split(',').join(' ');
        result = result.select(fieldList); 
    }

    // Navigate to Pages with Help of skip() & limit()
    // Converted String to Num as req.query has all String values
    const page_num  = Number(req.query.page) || 1;
    const limit_num = Number(req.query.limit) || 10;
    // Let say we have 34 docs in Collecn & We set limit 9 means each page must have 9 docs. So we have total 4 pages. With docs as 9 9 9 7.
    const skip_docs = (page_num-1)*(limit_num);
    // Perform skip() and limit() accordingly to user input so to navigate to required page.
    result = result.skip(skip_docs).limit(limit_num);
    
    // At Last After applying all the queries Resolved the Promise using await and stored the answer of resolved promise i.e. array of documnet in collection in AllProducts var which contains the final required List of Docs as per user's req.query inputs. 
    const AllProducts = await result;
    res.status(200).json({AllProducts, nbHits: AllProducts.length});
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}
