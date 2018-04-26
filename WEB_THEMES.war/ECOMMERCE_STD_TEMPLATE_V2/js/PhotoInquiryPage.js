$('.cimm_fileUpload').ajaxfileupload({
	'action' : 'UploadFile.slt',
	valid_extensions : ['png','jpg','jpeg'],
	'onComplete' : function(response) {
		unblock();
		if(response.status){
			//var uploadedFileNames = $('#uploadedFileNames').val();
			if(uploadedFileNames && uploadedFileNames.length > 0){
				//uploadedFileNames = uploadedFileNames + "," + response.message;
				$('#uploadedFileNames').val(response.message);
			}
			else if(response.message.length > 0){
				$('#uploadedFileNames').val(response.message);
			}
		}else{
			bootAlert("small","error","Error",response.message);
			$(this).val('');
		}
	},
	'onStart' : function() {
		block('Please Wait');
	}
});

$( "#cimm_customImageUpload > input").change(function() {
	var fileName = $(this)[0].files[0];
	if(fileName){
		var Filesize= this.files[0].size/1024/1024;
		if(Filesize >5){
			bootAlert("small","error","Error","Please upload file which is less than 5MB.");
			return false;
		}
		fileName = fileName.name
		$('#cimm_customImageUpload > span').text(fileName);
		previewImage(this);
	}
});

function previewImage(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			$('#enqitem').attr('src', e.target.result).show();
		}
		reader.readAsDataURL(input.files[0]);
	}
}