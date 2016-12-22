class CelebritySerializer < ActiveModel::Serializer
  attributes :id, :name, :bio, :photo, :category_ids, :book_ids
end