/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/wall_streets.json`.
 */
export type WallStreets = {
  "address": "NuRUuEzwhe5VFVJhZNGSzhZKPeeiyq1RhdeDQLiNgCa",
  "metadata": {
    "name": "wallStreets",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "approveProposal",
      "discriminator": [
        136,
        108,
        102,
        85,
        98,
        114,
        7,
        147
      ],
      "accounts": [
        {
          "name": "wallOwner",
          "writable": true,
          "signer": true
        },
        {
          "name": "artist"
        },
        {
          "name": "artistUserAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "artist"
              }
            ]
          }
        },
        {
          "name": "wallOwnerUserAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "wallOwner"
              }
            ]
          }
        },
        {
          "name": "wall",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wallOwnerUserAccount"
              },
              {
                "kind": "account",
                "path": "wall.wall_seed",
                "account": "wall"
              }
            ]
          },
          "relations": [
            "proposal"
          ]
        },
        {
          "name": "proposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              },
              {
                "kind": "account",
                "path": "proposal.proposal_seed",
                "account": "proposal"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "projectAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "wall"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          },
          "relations": [
            "wall"
          ]
        },
        {
          "name": "wallOwnerAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "wallOwner"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelProject",
      "discriminator": [
        104,
        149,
        3,
        136,
        160,
        3,
        13,
        132
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "artist",
          "writable": true,
          "relations": [
            "proposal"
          ]
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "multisig.wall",
                "account": "multisig"
              }
            ]
          }
        },
        {
          "name": "wallOwner",
          "relations": [
            "multisig",
            "wall"
          ]
        },
        {
          "name": "wallOwnerUserAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "wallOwner"
              }
            ]
          }
        },
        {
          "name": "wall",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wallOwnerUserAccount"
              },
              {
                "kind": "account",
                "path": "wall.wall_seed",
                "account": "wall"
              }
            ]
          },
          "relations": [
            "multisig",
            "proposal"
          ]
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "projectAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "wall"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "wallOwnerAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "wallOwner"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "proposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              },
              {
                "kind": "account",
                "path": "proposal.proposal_seed",
                "account": "proposal"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "closeAccounts",
      "discriminator": [
        171,
        222,
        94,
        233,
        34,
        250,
        202,
        1
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "wall",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wall.wall_owner_user_account",
                "account": "wall"
              },
              {
                "kind": "account",
                "path": "wall.wall_seed",
                "account": "wall"
              }
            ]
          },
          "relations": [
            "proposal",
            "expenses",
            "multisig"
          ]
        },
        {
          "name": "proposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              },
              {
                "kind": "account",
                "path": "proposal.proposal_seed",
                "account": "proposal"
              }
            ]
          }
        },
        {
          "name": "expenses",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  120,
                  112,
                  101,
                  110,
                  115,
                  101,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              }
            ]
          }
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "multisig.wall",
                "account": "multisig"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initNft",
      "discriminator": [
        181,
        181,
        103,
        206,
        79,
        44,
        134,
        193
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "archivePda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  114,
                  99,
                  104,
                  105,
                  118,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "wall",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wall.wall_owner_user_account",
                "account": "wall"
              },
              {
                "kind": "account",
                "path": "wall.wall_seed",
                "account": "wall"
              }
            ]
          }
        },
        {
          "name": "nftMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  116,
                  114,
                  97,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              }
            ]
          }
        },
        {
          "name": "metadata",
          "writable": true
        },
        {
          "name": "edition",
          "writable": true
        },
        {
          "name": "archiveAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "archivePda"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nftMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "wallOwnerUserAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "wall.wall_owner",
                "account": "wall"
              }
            ]
          }
        },
        {
          "name": "artistUserAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "wall.artist",
                "account": "wall"
              }
            ]
          }
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "metadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        }
      ],
      "args": []
    },
    {
      "name": "initializeArtist",
      "discriminator": [
        72,
        185,
        142,
        180,
        6,
        145,
        216,
        8
      ],
      "accounts": [
        {
          "name": "artist",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "artist"
              }
            ]
          }
        },
        {
          "name": "artistFeature",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeExpenses",
      "discriminator": [
        139,
        116,
        170,
        199,
        138,
        45,
        251,
        85
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "wallOwner",
          "relations": [
            "wall"
          ]
        },
        {
          "name": "wallOwnerUserAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "wallOwner"
              }
            ]
          }
        },
        {
          "name": "wall",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wallOwnerUserAccount"
              },
              {
                "kind": "account",
                "path": "wall.wall_seed",
                "account": "wall"
              }
            ]
          }
        },
        {
          "name": "expenses",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  120,
                  112,
                  101,
                  110,
                  115,
                  101,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeProposal",
      "discriminator": [
        50,
        73,
        156,
        98,
        129,
        149,
        21,
        158
      ],
      "accounts": [
        {
          "name": "artist",
          "writable": true,
          "signer": true
        },
        {
          "name": "wallOwner"
        },
        {
          "name": "artistUserAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "artist"
              }
            ]
          }
        },
        {
          "name": "wallOwnerUserAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "wallOwner"
              }
            ]
          }
        },
        {
          "name": "artistFeature",
          "writable": true
        },
        {
          "name": "wall",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wallOwnerUserAccount"
              },
              {
                "kind": "account",
                "path": "wall.wall_seed",
                "account": "wall"
              }
            ]
          }
        },
        {
          "name": "proposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              },
              {
                "kind": "account",
                "path": "wall.proposal_seeds",
                "account": "wall"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "offerPrice",
          "type": {
            "defined": {
              "name": "offerPrice"
            }
          }
        }
      ]
    },
    {
      "name": "initializeUser",
      "discriminator": [
        111,
        17,
        185,
        250,
        60,
        122,
        38,
        254
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "roleNumber",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeWall",
      "discriminator": [
        92,
        123,
        174,
        60,
        113,
        154,
        163,
        108
      ],
      "accounts": [
        {
          "name": "wallOwner",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "wallOwner"
              }
            ]
          }
        },
        {
          "name": "wall",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "userAccount"
              },
              {
                "kind": "account",
                "path": "user_account.wall_seeds",
                "account": "user"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "projectAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "wall"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    },
    {
      "name": "kickOffProject",
      "discriminator": [
        47,
        52,
        231,
        32,
        124,
        115,
        126,
        248
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "artist",
          "relations": [
            "multisig"
          ]
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "multisig.wall",
                "account": "multisig"
              }
            ]
          }
        },
        {
          "name": "wallOwner",
          "relations": [
            "multisig",
            "wall"
          ]
        },
        {
          "name": "wallOwnerUserAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "wallOwner"
              }
            ]
          }
        },
        {
          "name": "wall",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wallOwnerUserAccount"
              },
              {
                "kind": "account",
                "path": "wall.wall_seed",
                "account": "wall"
              }
            ]
          },
          "relations": [
            "multisig"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "mintNft",
      "discriminator": [
        211,
        57,
        6,
        167,
        15,
        219,
        35,
        251
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "wall",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wall.wall_owner_user_account",
                "account": "wall"
              },
              {
                "kind": "account",
                "path": "wall.wall_seed",
                "account": "wall"
              }
            ]
          }
        },
        {
          "name": "editionMarkPda",
          "writable": true
        },
        {
          "name": "archivePda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  114,
                  99,
                  104,
                  105,
                  118,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "metadataMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  116,
                  114,
                  97,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              }
            ]
          }
        },
        {
          "name": "metadata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "metadataProgram"
              },
              {
                "kind": "account",
                "path": "metadataMint"
              }
            ],
            "program": {
              "kind": "account",
              "path": "metadataProgram"
            }
          }
        },
        {
          "name": "masterEdition",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "metadataProgram"
              },
              {
                "kind": "account",
                "path": "metadataMint"
              },
              {
                "kind": "const",
                "value": [
                  101,
                  100,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "metadataProgram"
            }
          }
        },
        {
          "name": "archiveAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "archivePda"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "metadataMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "newMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  116,
                  114,
                  97,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              },
              {
                "kind": "account",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "newMintAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "newMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "newMetadata",
          "docs": [
            "CHECK"
          ],
          "writable": true
        },
        {
          "name": "newEdition",
          "docs": [
            "CHECK"
          ],
          "writable": true
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "metadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        }
      ],
      "args": [
        {
          "name": "metadataBump",
          "type": "u8"
        },
        {
          "name": "editionBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "recordRecipt",
      "discriminator": [
        16,
        199,
        226,
        244,
        69,
        79,
        146,
        213
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "wallOwner"
        },
        {
          "name": "wallOwnerUserAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "wallOwner"
              }
            ]
          }
        },
        {
          "name": "receipt",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  99,
                  101,
                  105,
                  112,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              },
              {
                "kind": "account",
                "path": "expenses.seeds",
                "account": "expenses"
              }
            ]
          }
        },
        {
          "name": "expenses",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  120,
                  112,
                  101,
                  110,
                  115,
                  101,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              }
            ]
          }
        },
        {
          "name": "wall",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wallOwnerUserAccount"
              },
              {
                "kind": "account",
                "path": "wall.wall_seed",
                "account": "wall"
              }
            ]
          },
          "relations": [
            "proposal"
          ]
        },
        {
          "name": "proposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              },
              {
                "kind": "account",
                "path": "proposal.proposal_seed",
                "account": "proposal"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "settleProject",
      "discriminator": [
        34,
        200,
        181,
        57,
        167,
        229,
        53,
        22
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "artist",
          "relations": [
            "multisig"
          ]
        },
        {
          "name": "wallOwner",
          "relations": [
            "multisig",
            "wall"
          ]
        },
        {
          "name": "multisig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  117,
                  108,
                  116,
                  105,
                  115,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "multisig.wall",
                "account": "multisig"
              }
            ]
          }
        },
        {
          "name": "wallOwnerUserAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "wallOwner"
              }
            ]
          }
        },
        {
          "name": "wall",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wallOwnerUserAccount"
              },
              {
                "kind": "account",
                "path": "wall.wall_seed",
                "account": "wall"
              }
            ]
          },
          "relations": [
            "multisig",
            "proposal"
          ]
        },
        {
          "name": "expenses",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  101,
                  120,
                  112,
                  101,
                  110,
                  115,
                  101,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              }
            ]
          }
        },
        {
          "name": "proposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "wall"
              },
              {
                "kind": "account",
                "path": "proposal.proposal_seed",
                "account": "proposal"
              }
            ]
          }
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "projectAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "wall"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "wallOwnerAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "wallOwner"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "artistAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "artist"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "usdcMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "artistFeature",
      "discriminator": [
        74,
        95,
        254,
        153,
        171,
        244,
        21,
        45
      ]
    },
    {
      "name": "expenses",
      "discriminator": [
        60,
        231,
        97,
        246,
        115,
        11,
        236,
        135
      ]
    },
    {
      "name": "multisig",
      "discriminator": [
        224,
        116,
        121,
        186,
        68,
        161,
        79,
        236
      ]
    },
    {
      "name": "proposal",
      "discriminator": [
        26,
        94,
        189,
        187,
        116,
        136,
        53,
        33
      ]
    },
    {
      "name": "receipt",
      "discriminator": [
        39,
        154,
        73,
        106,
        80,
        102,
        145,
        153
      ]
    },
    {
      "name": "user",
      "discriminator": [
        159,
        117,
        95,
        227,
        239,
        151,
        58,
        236
      ]
    },
    {
      "name": "wall",
      "discriminator": [
        246,
        132,
        243,
        249,
        165,
        137,
        54,
        35
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "noSpaceAvailable",
      "msg": "Not space available"
    },
    {
      "code": 6001,
      "name": "unexpectedStatus",
      "msg": "Unexpected status"
    },
    {
      "code": 6002,
      "name": "proposalExsits",
      "msg": "Wall already has an arrpvoed proposal"
    },
    {
      "code": 6003,
      "name": "unmuchedProposal",
      "msg": "unmuched proposal with this wall"
    },
    {
      "code": 6004,
      "name": "invalidBudget",
      "msg": "Invalid budget amount"
    }
  ],
  "types": [
    {
      "name": "artistFeature",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "offerWall",
            "type": {
              "array": [
                "pubkey",
                15
              ]
            }
          }
        ]
      }
    },
    {
      "name": "expenses",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "seeds",
            "type": "u16"
          },
          {
            "name": "wall",
            "type": "pubkey"
          },
          {
            "name": "artist",
            "type": "pubkey"
          },
          {
            "name": "total",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "multisig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "wall",
            "type": "pubkey"
          },
          {
            "name": "wallOwner",
            "type": "pubkey"
          },
          {
            "name": "artist",
            "type": "pubkey"
          },
          {
            "name": "isWallOwnerSigned",
            "type": "bool"
          },
          {
            "name": "isArtistSigned",
            "type": "bool"
          },
          {
            "name": "isKickOff",
            "type": "bool"
          },
          {
            "name": "isSettled",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "offerPrice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cost",
            "type": "u64"
          },
          {
            "name": "profit",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "proposalSeed",
            "type": "u64"
          },
          {
            "name": "artist",
            "type": "pubkey"
          },
          {
            "name": "wall",
            "type": "pubkey"
          },
          {
            "name": "offerPrice",
            "type": {
              "defined": {
                "name": "offerPrice"
              }
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "status"
              }
            }
          }
        ]
      }
    },
    {
      "name": "receipt",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "role",
      "repr": {
        "kind": "rust"
      },
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "fun"
          },
          {
            "name": "artist"
          },
          {
            "name": "wallOwner"
          }
        ]
      }
    },
    {
      "name": "status",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "draft"
          },
          {
            "name": "active"
          },
          {
            "name": "done"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "wallMints",
            "type": {
              "array": [
                "pubkey",
                30
              ]
            }
          },
          {
            "name": "role",
            "type": {
              "defined": {
                "name": "role"
              }
            }
          },
          {
            "name": "isArtist",
            "type": "bool"
          },
          {
            "name": "wallSeeds",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "wall",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "wallSeed",
            "type": "u16"
          },
          {
            "name": "wallOwner",
            "type": "pubkey"
          },
          {
            "name": "wallOwnerUserAccount",
            "type": "pubkey"
          },
          {
            "name": "artist",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "projectAta",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "status"
              }
            }
          },
          {
            "name": "proposalSeeds",
            "type": "u64"
          },
          {
            "name": "proposal",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "nftBump",
            "type": {
              "option": "u8"
            }
          }
        ]
      }
    }
  ]
};
