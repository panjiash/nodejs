import con from "../config/db.js";

export const getTesting = (req, res) => {
    con.query('SELECT a.*, s.jenis_kelamin FROM testing a JOIN testing_dua s ON a.jk = s.id ', (err, rows) => {
        if (err) throw err;
        res.json({
            status: 1,
            data: rows
        })
    });
}

export const saveTesting = (req, res) => {
    const nama = req.body.nama
    const alamat = req.body.alamat
    const jk = req.body.jk

    const cek = con.query(`SELECT * FROM testing WHERE nama = '${nama}'`, (err, ress) => {
        if (err) throw err;
        const numRows = ress.length
        if (numRows > 0) {
            res.json({
                status: 1,
                msg: 'Data sudah ada!'
            })
        } else {
            const insert = con.query(`INSERT INTO testing VALUES (null, '${req.body.nama}','${req.body.alamat}','${req.body.jk}')`);
            if (insert) {
                res.json({
                    status: 2,
                    msg: "Data berhasil disimpan!"
                });
            } else {
                res.json({
                    status: 3,
                    msg: "Data gagal disimpan!"
                })
            }
        }

    })

}