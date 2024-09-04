export const generateSignString = (length : number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    let sign = '';
  
    for (var i = 0; i < length; i++) {
      let randomPos = Math.floor(Math.random() * characters.length);
      sign += characters.charAt(randomPos);
    }
  
    return 'Sign this for security check ' + sign;
}