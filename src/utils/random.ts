import sequelize from "../libs/sequelize"

export const generateRandomUsername = async () => { 
    const totalUsers = await sequelize.models.User.count();
    return `user_${totalUsers + 1}`;
};

export const generateSignString = (length : number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    let sign = '';
  
    for (var i = 0; i < length; i++) {
      let randomPos = Math.floor(Math.random() * characters.length);
      sign += characters.charAt(randomPos);
    }
  
    return 'Sign this for security check ' + sign;
}

export const generateRandomCode = (length : number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (var i = 0; i < length; i++) {
    let randomPos = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomPos);
  }

  return code;
}

export const generateBytes = (length: number = 32): string =>{
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  return Array.from(array).map(byte => byte.toString(16).padStart(2, '0')).join('');
}