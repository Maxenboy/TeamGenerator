class CreateNamelists < ActiveRecord::Migration
  def change
    create_table :namelists do |t|
      t.text :area
      t.text :mentext
      t.text :womentext

      t.timestamps
    end
  end
end
