function User() {
    this.name="";
    this.life = 100;
    this.giveLife= function giveLife(targetplayer){
        targetplayer.life += 1;
        console.log(this.name + " gave 1 life to "+ targetplayer.name   )
    }

}
var Thobby = new User();
var Tosin = new User();

Thobby.name="tobi";
Tosin.name ="tosin";
Thobby.giveLife(Tosin);
console.log("Thobby:"+ Thobby.life);
console.log("Tosin:"+ Tosin.life);

User.prototype.uppercut = function uppercut (targetplayer) {
    targetplayer.life -= 5;
    console.log(this.name + " upper cutted "+ targetplayer.name);


};
Thobby.uppercut(Tosin);
console.log("Thobby:"+ Thobby.life);
console.log("Tosin:"+ Tosin.life);

User.prototype.backhand =function backhand(targetplayer) {
    targetplayer.life -=20;
    console.log(this.name + " gave a backhand to " + targetplayer.name);

};
Tosin.backhand(Thobby);
console.log("Thobby:"+ Thobby.life);
console.log("Tosin:"+ Tosin.life);

    
User.prototype.magic =60;
console.log(Thobby.magic);
console.log(Tosin.magic);
