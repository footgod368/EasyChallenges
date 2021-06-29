module Level1Init exposing (init)

{-| Init of Level1 Model.

# init
@docs init

-}

import Array
import Event
import Brick
import GlobalBasics
import Level1Type
import Player

{-| `init` of Level1 `Model
-}
init : Level1Type.Model
init =
    { actEvent = (Array.fromList [])
    , event = (Array.fromList
    [ Event.init
            { id = 1, name = "Event1" }
            Event.StartActivated
            (Event.PlayerCollide
                (GlobalBasics.Polygon
                    (Array.fromList
                        [ ((560,0),(560.0,1000.0))
                        ]
                    )
                )
            )
            (Event.quickDuration 10)
    , Event.init
            { id = 2, name = "Event2" }
            Event.StartActivated
            (Event.PlayerCollide
                (GlobalBasics.Polygon
                    (Array.fromList
                        [ ((200,440),(240.0,440.0))
                        , ((240,440),(240.0,480.0))
                        , ((240,480),(200.0,480.0))
                        , ((200,480),(200.0,440.0))
                        ]
                    )
                )
            )
            (Event.quickDuration 10)
    ]
            )
    , player = (Player.init ( 60.0, 480.0 ))
    , bricks = (Array.fromList
        ( List.concat
        [( List.map (\i -> Brick.quickInit ( GlobalBasics.blockPos ( i, 15 ) ) ) ( List.range 1 5 ) )
        , [ Brick.init
              ( GlobalBasics.blockPos ( 5, 12 ) )
              Brick.defBrickCollisionBox
              Brick.NoAppearance
              ( Brick.Visible Brick.NoNextBrickVisibility )
              ( Brick.Collide Brick.NoNextBrickCollision )
              ( Brick.NoNextBrickMove )
          ]
        , [ Brick.init
                ( GlobalBasics.blockPos ( 6, 12 ) )
                Brick.defBrickCollisionBox
                Brick.NoAppearance
                ( Brick.Invisible ( Brick.VisibleAfterEvent 2 Brick.NoNextBrickVisibility) )
                ( Brick.Collide Brick.NoNextBrickCollision )
                ( Brick.NoNextBrickMove )
          ]
        , [ Brick.init
                ( GlobalBasics.blockPos ( 15, 14 ) )
                Brick.defBrickCollisionBox
                Brick.NoAppearance
                ( Brick.Visible Brick.NoNextBrickVisibility )
                ( Brick.Collide Brick.NoNextBrickCollision )
                ( Brick.Move
                    ( Array.fromList [] )
                    0.0
                    1
                    ( Brick.Move
                        ( Array.fromList
                            [ GlobalBasics.blockPos ( 20, 14 )
                            ]
                        )
                        5.0
                        -1
                        Brick.NoNextBrickMove
                    )
                )
          ]
        ]
        )
        )
    , keyPressed = []
    }