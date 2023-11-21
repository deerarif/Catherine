#ssh -L 3306:192.168.0.13:3306 root@143.42.69.150
# -*- coding: utf-8 -*-
import pandas as pd
import sqlalchemy
from datetime import datetime

new_file_path = 'Data.xlsx'
Stocks_Barang = pd.read_excel(new_file_path,sheet_name="STOCK",index_col=None) #data untuk barang
Data_Order = pd.read_excel(new_file_path,sheet_name="PDF",index_col=None) #data untuk Dealer/Orderan
bf = pd.read_excel(new_file_path,sheet_name="STD DUS",index_col=None) #data untuk Stock_Barang dus buat cek harga dari order
Data_No_HP_Dealer = pd.read_excel(new_file_path,sheet_name="DATA TEALER",index_col=None) #data dealer
Stocks_Barang = Stocks_Barang.drop(Stocks_Barang.columns.difference(['Input',"Ket1","STD DUS","HET","Respon"]), axis=1)
Stocks_Barang.rename(columns={'Input': 'Kode_Barang', 'Ket1': 'Nama_Barang', 'STD DUS' : 'QTY_Dus_Barang','HET': 'Harga_Barang','Respon':'Status_Barang'}, inplace=True)
Data_Order = Data_Order.drop(Data_Order.columns.difference(['Code Customer','Material','Deskripsi','Quantity','Harga Jual (HET)','Total Percent (%)','Cost Amount','Created on']), axis=1)
Data_Order = Data_Order.rename(columns={'Code Customer':'Kode_Dealer','Material':'Kode_Barang','Deskripsi':'Nama_Barang','Harga Jual (HET)':'Harga_Barang','Total Percent (%)':'Diskon','Cost Amount':'Total','Created on':'Tanggal_Order'})
Data_No_HP_Dealer = Data_No_HP_Dealer.drop(Data_No_HP_Dealer.columns.difference(['KODE',"NAMA","Unnamed: 8"]), axis=1)
Data_No_HP_Dealer = Data_No_HP_Dealer.drop(index=0)
Data_No_HP_Dealer.rename(columns={'Unnamed: 8':'No_HP'}, inplace=True)
bf = bf.drop(bf.columns.difference(['P/N SAP','Cost Price']), axis=1)
bf.rename(columns={'P/N SAP':'Kode_Barang'}, inplace=True)
tanggal = datetime.now().strftime('%Y-%m-%d')
tgl = pd.DataFrame(data={"Data_Updated_at":[tanggal]})

server = '127.0.0.1'
database = 'Catherine'
username = 'Catherine'
password = 'Samarinda12309'
database_connection = sqlalchemy.create_engine('mysql+mysqlconnector://{0}:{1}@{2}/{3}'.
                                               format(username, password,
                                                      server, database))

Stocks_Barang.to_sql("Stock_Barang", database_connection,if_exists='replace',index=False,dtype={
    "Kode_Barang":sqlalchemy.types.String(20)
})
tgl.to_sql("Tanggal_Data", database_connection,if_exists='replace',index=False,dtype={
    "Data_Updated_at":sqlalchemy.types.Date
})
Data_Order.to_sql("Orderan", database_connection,if_exists='replace',index=False,dtype={
    "Kode_Dealer":sqlalchemy.types.String(25),
    "Tanggal_Order":sqlalchemy.types.DATE
})
# bf.to_sql("Harga_brng", database_connection,if_exists='replace',index=False)
Data_No_HP_Dealer.to_sql("Data_Dealer", database_connection,if_exists='replace',index=False)