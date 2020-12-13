import routerx from 'express-promise-router'
import lancamentosController from '../controllers/lancamentosController'

const router = routerx()

router.post('/', lancamentosController.add)
router.put('/:id', lancamentosController.update)
router.get('/', lancamentosController.list)
router.get('/:id', lancamentosController.findById)
router.get('/usuario/:id', lancamentosController.listByUser)
router.get('/confirmados/:id', lancamentosController.listLancamentoConfirmado)
router.get('/negativo/:id', lancamentosController.listLancamentoNegativo)
router.get('/pendentes/:id', lancamentosController.listLancamentoPendentes)
router.get('/despesa/:id', lancamentosController.listLancamentoDespesa)
router.get('/receita/:id', lancamentosController.listLancamentoReceita)
router.get('/ano/:id', lancamentosController.listarPorAno)
router.get('/primeirosemestre/:id', lancamentosController.listarPorPrimeiroSemestre)
router.get('/segundosemestre/:id', lancamentosController.listarPorSegundoSemestre)
router.delete('/delete/:id', lancamentosController.delete)
export default router