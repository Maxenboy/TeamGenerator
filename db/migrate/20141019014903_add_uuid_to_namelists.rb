class AddUuidToNamelists < ActiveRecord::Migration
  def change
    add_column :namelists, :uuid, :string
  end
end
