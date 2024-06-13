const { WarhouseProduct } = require("../../models/WarhouseProduct/WarhouseProduct");

module.exports.getWarhouseTransferProducts = async (req, res) => {
    try {
        const { market, type, startDate, endDate, currentPage, countPage } = req.body;

        let warhouseproducts = []
        let count = 0;

        if (type === 'income') {
            warhouseproducts = await WarhouseProduct.find({
                market,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            })
                .sort({ createdAt: -1 })
                .select('-__v -updatedAt -isArchive')
                .populate('market', 'name')
                .populate('filial', 'name')
                .limit(countPage)
                .skip(currentPage * countPage);

            count = await WarhouseProduct.find({
                market,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).count()
        }
        if (type === 'outcome') {
            warhouseproducts = await WarhouseProduct.find({
                filial: market,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            })
                .sort({ createdAt: -1 })
                .select('-__v -updatedAt -isArchive')
                .populate('market', 'name')
                .populate('filial', 'name')
                .limit(countPage)
                .skip(currentPage * countPage);

            count = await WarhouseProduct.find({
                filial: market,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).count()
        }

        res.status(200).json({ warhouseproducts, count });
    } catch (error) {
        res.status(501).json({ error: "Serverda xatolik yuz berdi..." });
    }
}