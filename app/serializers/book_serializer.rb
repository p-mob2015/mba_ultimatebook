class BookSerializer < ActiveModel::Serializer
  attributes :id, :title, :author, :summary, :isbn, :amazon, :cover, :genre_ids, :celebrity_ids
end