class Api::UploadController < ApplicationController
  def person
    begin
      File.delete("public/uploads/celebrity/#{photo_params[:old]}") unless photo_params[:old].nil?
    rescue => ex
      logger.error ex.message
    end
    
    uploader = PersonUploader.new(photo_params[:name])
    uploader.store!(photo_params[:file])
  end

  def book
    begin
      File.delete("public/uploads/book/#{cover_params[:old]}") unless cover_params[:old].nil?
    rescue => ex
      logger.error ex.message
    end    

    uploader = BookUploader.new(cover_params[:name])
    uploader.store!(cover_params[:file])
  end

  private

  def photo_params
    params.require(:photo).permit(:old, :name, :file)
  end

  def cover_params
    params.require(:cover).permit(:old, :name, :file)
  end
end