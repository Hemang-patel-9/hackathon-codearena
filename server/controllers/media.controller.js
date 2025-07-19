const path = require('path');
const fs = require('fs');

// Upload media controller
const uploadMedia = (req, res) => {
	if (!req.file) {
		return res.status(400).json({ data: null, error: 'No file uploaded.', message: 'No file uploaded.' });
	}
	res.status(200).json({
		data: { filename: req.file.path },
		error: null,
		message: 'File uploaded successfully.'
	});
};

// Delete media controller
const deleteMedia = (req, res) => {
	// filename = media\\file-1752775158459-815821089.jpg
	const filename = req.params.filename;
	console.log(`Deleting file: ${JSON.stringify(req.params)}`);
	const filePath = path.join(__dirname, '..', 'media', filename);

	fs.unlink(filePath, (err) => {
		if (err) {
			return res.status(404).json({ data: null, error: 'File not found.', message: 'File not found.' });
		}
		res.status(200).json({
			data: { filename },
			error: null,
			message: 'File deleted successfully.'
		});
	});
};

module.exports = {
	uploadMedia,
	deleteMedia,
};