const resize = (event) => {
    gm(event.name)
	.resize(event.p1, event.p2, "!")
	.write(event.name, function(err){
	    if (err) throw err
	    console.log("Worked ^^");
	});
};
