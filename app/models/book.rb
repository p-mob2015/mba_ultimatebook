class Book
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title, type: String
  field :author, type: String
  field :summary, type: String
  field :isbn, type: String
  field :amazon, type: String
  field :cover, type: String
  
  has_and_belongs_to_many :celebrities, class_name: 'Celebrity'  
  has_and_belongs_to_many :genres, class_name: 'Genre'

  def id
    self._id.to_s
  end

  def genre_ids
    genres.map {|c| c._id.to_s}
  end

  def celebrity_ids
    celebrities.map {|c| c._id.to_s}
  end

  def assign_genres(genre_ids)
    self.genres = []
    (genre_ids || []).each do |genre_id|
      self.genres << Genre.find(genre_id)
    end

    self.save
  end
end