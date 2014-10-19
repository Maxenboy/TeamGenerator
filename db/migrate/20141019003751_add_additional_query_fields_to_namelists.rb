class AddAdditionalQueryFieldsToNamelists < ActiveRecord::Migration
  def change
    add_column :namelists, :choice, :string
    add_column :namelists, :nbr_of_teams, :integer
  end
end
