import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Record extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName: 'name'})
  public name: string

  @column({columnName:'email'})
  public email: string
  
  @column({columnName: 'phone'})
  public phone: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
