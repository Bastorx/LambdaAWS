const rotate = (event) => {
    gm(event.name)
	.rotate("white", event.p1)
	.write(event.name, function(err){
	    if (err) throw err
	    console.log("Worked ^^")
	});
};
