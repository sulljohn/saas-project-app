# Source: https://www.udemy.com/course/the-complete-ruby-on-rails-developer-course/learn/lecture/4029808#questions/4973702

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :validatable

  acts_as_universal_and_determines_account

  has_one :member, :dependent => :destroy

  def is_admin?
    is_admin
  end
end