import { response } from "express";
import { Lancamentos, Usuario } from "../database/models";
import { Op } from "sequelize";
import { startOfDay, endOfDay, parseISO } from "date-fns";

export default {
  add: (req, res, next) => {
    try {
      Lancamentos.create(req.body)
        .then((response) => {
          res.status(201).json({ sucess: true, lancamentos: response });
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({
            error: error,
            sucess: false,
            message: "Ocorreu um erro enquanto os dados eram inseridos.",
          });
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });
      next(error);
    }
  },

  update: (req, res, next) => {
    try {
      Lancamentos.findOne({ where: { id: req.params.id } })
        .then((lancamentos) => {
          if (lancamentos) {
            return lancamentos.update(req.body).then((response) => {
              res.status(200).json({ success: true, lancamentos: response });
            });
          } else {
            res.status(404).json({
              success: false,
              message: "O registro solicitado não foi encontrado no sistema.",
            });
          }
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto os dados eram atualizados.",
          });
          console.log(error);
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });
      next(error);
    }
  },

  list: (req, res, next) => {
    try {
      Lancamentos.findAll({
        // where:{usuario_id: req.params.id},
        attributes: {
          exclude: ["usuario_id"],
        },
        include: [
          {
            model: Usuario,
            as: "usuarios",
          },
        ],
      })
        .then((response) => {
          res.status(200).json({ success: true, lancamentos: response });
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto os dados eram recuperados.",
          });
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });

      next(error);
    }
  },

  findById: (req, res, next) => {
    try {
      Lancamentos.findOne({ where: { id: req.params.id } })
        .then((response) => {
          res.status(200).json({ success: true, lancamentos: response });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto o dado era recuperado.",
          });
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });
      next(error);
    }
  },

  delete: (req, res, next) => {
    try {
      const deleted = Lancamentos.destroy({
        where: { id: req.params.id },
      });
      if (deleted) {
        return res.status(204).send("Deletado");
      }
      throw new Error("Post not found");
    } catch (error) {
      console.log(error);
      return res.status(500).send(error.message);
    }
  },

  listByUser: (req, res, next) => {
    try {
      Lancamentos.findAll({
        where: { usuario_id: req.params.id },
        attributes: {
          exclude: ["usuario_id"],
        },
        include: [
          {
            model: Usuario,
            as: "usuarios",
          },
        ],
      })
        .then((response) => {
          res.status(200).json({ success: true, lancamentos: response });
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto os dados eram recuperados.",
          });
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });

      next(error);
    }
  },

  listLancamentoConfirmado: (req, res, next) => {
    try {
      Lancamentos.findAll({
        where: { usuario_id: req.params.id },
        attributes: {
          exclude: ["usuario_id"],
        },
        include: [
          {
            model: Usuario,
            as: "usuarios",
            // where:{usuario_id: req.params.id},
          },
        ],
      })
        .then((response) => {
          res.status(200).json({
            success: true,
            // lancamentos: response
            lancamentos: response.filter(
              (lanc) => lanc.status === "Confirmado"
            ),
            // lancamentos: lancamentos.filter((lanc) => lancamentos.status == 'Confirmado')
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto os dados eram recuperados.",
          });
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });

      next(error);
    }
  },

  listLancamentoNegativo: (req, res, next) => {
    try {
      Lancamentos.findAll({
        where: { usuario_id: req.params.id },
        attributes: {
          exclude: ["usuario_id"],
        },
        include: [
          {
            model: Usuario,
            as: "usuarios",
            // where:{usuario_id: req.params.id},
          },
        ],
      })
        .then((response) => {
          res.status(200).json({
            success: true,
            // lancamentos: response
            lancamentos: response.filter((lanc) => lanc.status === "Negativo"),
            // lancamentos: lancamentos.filter((lanc) => lancamentos.status == 'Confirmado')
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto os dados eram recuperados.",
          });
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });

      next(error);
    }
  },

  listLancamentoPendentes: (req, res, next) => {
    try {
      Lancamentos.findAll({
        where: { usuario_id: req.params.id },
        attributes: {
          exclude: ["usuario_id"],
        },
        include: [
          {
            model: Usuario,
            as: "usuarios",
            // where:{usuario_id: req.params.id},
          },
        ],
      })
        .then((response) => {
          res.status(200).json({
            success: true,
            // lancamentos: response
            lancamentos: response.filter((lanc) => lanc.status === "Pendente"),
            // lancamentos: lancamentos.filter((lanc) => lancamentos.status == 'Confirmado')
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto os dados eram recuperados.",
          });
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });

      next(error);
    }
  },

  listLancamentoDespesa: (req, res, next) => {
    try {
      Lancamentos.findAll({
        where: { usuario_id: req.params.id },
        attributes: {
          exclude: ["usuario_id"],
        },
        include: [
          {
            model: Usuario,
            as: "usuarios",
          },
        ],
      })
        .then((response) => {
          res.status(200).json({
            success: true,
            // lancamentos: response
            lancamentos: response.filter(
              (lanc) => lanc.tipo_lancamento === "Despesa"
            ),
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto os dados eram recuperados.",
          });
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });

      next(error);
    }
  },

  listLancamentoReceita: (req, res, next) => {
    try {
      Lancamentos.findAll({
        where: { usuario_id: req.params.id },
        attributes: {
          exclude: ["usuario_id"],
        },
        include: [
          {
            model: Usuario,
            as: "usuarios",
            // where:{usuario_id: req.params.id},
          },
        ],
      })
        .then((response) => {
          res.status(200).json({
            success: true,
            // lancamentos: response
            lancamentos: response.filter(
              (lanc) => lanc.tipo_lancamento === "Receita"
            ),
            // lancamentos: lancamentos.filter((lanc) => lancamentos.status == 'Confirmado')
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto os dados eram recuperados.",
          });
        });
    } catch (error) {
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });

      next(error);
    }
  },

  listarPorAno: (req, res, next) => {
    try {
      Lancamentos.findAll({
        // where:{usuario_id: req.params.id},
        attributes: {
          exclude: ["usuario_id"],
        },
        include: [
          {
            model: Usuario,
            as: "usuarios",
          },
        ],
        where: {
          usuario_id: req.params.id,
          data: {
            [Op.between]: [
                "2019-12-31","2020-12-31"
                // dataAtual,"2020-12-31"
                // startDate, endDate
            ],
     
          },
        },
      })
        .then((response) => {
          res.status(200).json({ success: true, lancamentos: response });
        })
        .catch((error) => {
          
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto os dados eram recuperados.",
          });
        });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });

      next(error);
    }
  },
  listarPorPrimeiroSemestre: (req, res, next) => {
    try {
      Lancamentos.findAll({
        // where:{usuario_id: req.params.id},
        attributes: {
          exclude: ["usuario_id"],
        },
        include: [
          {
            model: Usuario,
            as: "usuarios",
          },
        ],
        where: {
          usuario_id: req.params.id,
          data: {
            [Op.between]: [
                "2019-12-31","2020-07-01"
            ],
     
          },
        },
      })
        .then((response) => {
          res.status(200).json({ success: true, lancamentos: response });
        })
        .catch((error) => {
          
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto os dados eram recuperados.",
          });
        });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });

      next(error);
    }
  },

  listarPorSegundoSemestre: (req, res, next) => {
    try {
      Lancamentos.findAll({
        // where:{usuario_id: req.params.id},
        attributes: {
          exclude: ["usuario_id"],
        },
        include: [
          {
            model: Usuario,
            as: "usuarios",
          },
        ],
        where: {
          usuario_id: req.params.id,
          data: {
            [Op.between]: [
                "2020-07-01","2021-01-01"
            ],
     
          },
        },
      })
        .then((response) => {
          res.status(200).json({ success: true, lancamentos: response });
        })
        .catch((error) => {
          
          res.status(400).json({
            error: error,
            success: false,
            message: "Ocorreu um erro enquanto os dados eram recuperados.",
          });
        });
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: error,
        success: false,
        message: "Ocorreu um erro desconhecido com o sistema.",
      });

      next(error);
    }
  },
};
