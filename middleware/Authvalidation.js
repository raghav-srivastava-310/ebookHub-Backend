import Joi from 'joi';


export const signUpValidation = (req,res,next)=>{
  const schema = Joi.object({
    name:Joi.string().min(3).max(30).required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    confirmPassword:Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Confirm password must match password'
    }),
   
  })
  const {error} =schema.validate(req.body);
  if(error){
    return res.status(400).json({error:error.details[0].message})
  }
  next();
}
// export const signInValidation = (req,res,next)=>{
//    const schema = Joi.object({
//     email:Joi.string().email().required(),
//     password:Joi.string().min(6).required(),
//    })
//    const {error} = schema.validate(req.body);
//    if(error){
//     return res.status(400).json({error:error.details[0].message})
//    }
//    next();
// }