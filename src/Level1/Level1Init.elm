module Level1Init exposing (init)

{-| Init of Level1 Model.


# init

@docs init

-}

import Array
import Boundary
import Brick
import Browser.Dom exposing (getViewport)
import Event
import GlobalBasics
import Level1Type
import MainType
import Player
import Task
import SavePoint
import EndPoint


{-| `init` of Level1 \`Model
-}
init : ( Level1Type.Model, Cmd MainType.Msg )
init =
    ( { windowBoundary = ( 1000.0, 800.0 )
    , levelBoundary = ( 1000.0, 680.0 )
    , actEvent = Array.fromList []
    , event =
        Array.fromList
            [
            Event.init
                { id = 1, name = "Event1" }
                Event.StartActivated
                (Event.PlayerCollide
                    (GlobalBasics.Polygon
                        (Array.fromList
                            [ ( ( 360, 0 ), ( 360.0, 520.0 ) )
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
                            [ ( ( 200, 440 ), ( 240.0, 440.0 ) )
                            , ( ( 240, 440 ), ( 240.0, 480.0 ) )
                            , ( ( 240, 480 ), ( 200.0, 480.0 ) )
                            , ( ( 200, 480 ), ( 200.0, 440.0 ) )
                            ]
                        )
                    )
                )
                (Event.quickDuration 10)
            , Event.init
                { id = 3, name = "Event3" }
                Event.StartActivated
                (Event.PlayerCollide
                    (GlobalBasics.Polygon
                        (Array.fromList
                            [ ( ( 660, 500 ), ( 660, 540 ) )
                            , ( ( 660, 540 ), ( 700, 540 ) )
                            , ( ( 700, 540 ), ( 700, 520 ) )
                            , ( ( 700, 520 ), ( 660, 500 ) )
                            ]
                        )
                    )
                )
                (Event.quickDuration 10)
            ]
    , boundary = Boundary.normalInit
    , player = Player.init ( 50.0, 490.0 )
    , bricks =
        Array.fromList
            (List.concat
                [ List.map (\i -> Brick.quickInit (GlobalBasics.blockPos ( i, 15 ))) (List.range 1 5)
                , List.map (\i -> Brick.quickInit (GlobalBasics.blockPos ( i, 12 ))) (List.range 2 5)
                , [ Brick.init
                        (GlobalBasics.blockPos ( 18, 14 ))
                        Brick.defBrickCollisionBox
                        Brick.NoAppearance
                        (Brick.Visible (Brick.InvisibleAfterEvent 3 Brick.NoNextBrickVisibility))
                        (Brick.NoCollide Brick.NoNextBrickCollision)
                        (Brick.NoNextBrickMove)
                  ]
                , [ Brick.quickInit (GlobalBasics.blockPos ( 14, 14 ))
                  ]
                , List.map (\i -> Brick.quickInit (GlobalBasics.blockPos ( 19, i ))) (List.range 11 14)
                , [ Brick.init
                        (GlobalBasics.blockPos ( 6, 12 ))
                        Brick.defBrickCollisionBox
                        Brick.NoAppearance
                        (Brick.Invisible (Brick.VisibleAfterEvent 2 Brick.NoNextBrickVisibility))
                        (Brick.Collide Brick.NoNextBrickCollision)
                        Brick.NoNextBrickMove
                  ]
                , [ Brick.init
                        (GlobalBasics.blockPos ( 10, 14 ))
                        Brick.defBrickCollisionBox
                        Brick.NoAppearance
                        (Brick.Visible Brick.NoNextBrickVisibility)
                        (Brick.Collide Brick.NoNextBrickCollision)
                        (Brick.Move
                            (Array.fromList [])
                            0.0
                            1
                            (Brick.Move
                                (Array.fromList
                                    [ GlobalBasics.blockPos ( 13, 14 )
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
    , savePoints = 
        Array.fromList([SavePoint.init (GlobalBasics.blockPos (2, 14)), SavePoint.init (GlobalBasics.blockPos (14, 13))])
    , endPoint = EndPoint.init ( GlobalBasics.blockPos( 22, 14 ))
    , keyPressed = []
    },
    Task.perform MainType.GetViewport getViewport)
