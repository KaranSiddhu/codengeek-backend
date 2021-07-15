exports.getPrivateData = (req, res) => {
    res.status(200).json({
        success:true,
        data:'You got access to private data',
        user: req.user
    });

    console.log(req.user);
}