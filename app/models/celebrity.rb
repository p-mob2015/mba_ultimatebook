class Celebrity
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :bio, type: String
  field :photo, type: String

  validates :name, presence: true

  has_and_belongs_to_many :categories, class_name: 'Category'
  has_and_belongs_to_many :books, class_name: 'Book'

  def id
    self._id.to_s
  end

  def category_ids
    categories.map {|c| c._id.to_s}
  end

  def book_ids
    books.map {|c| c._id.to_s}
  end

  def assign_categories(category_ids)
    self.categories = []
    (category_ids || []).each do |category_id|
      self.categories << Category.find(category_id)
    end

    self.save
  end

  def assign_books(book_ids)
    self.books = []
    (book_ids || []).each do |book_id|
      self.books << Book.find(book_id)
    end

    self.save
  end
end