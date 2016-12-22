class Genre
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title, type: String
  
  has_and_belongs_to_many :celebrities, class_name: 'Celebrity'

  def id
    self._id.to_s
  end
end